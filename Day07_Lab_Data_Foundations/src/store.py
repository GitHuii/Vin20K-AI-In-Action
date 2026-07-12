from __future__ import annotations

from typing import Any, Callable

from .chunking import _dot, compute_similarity
from .embeddings import _mock_embed
from .models import Document


class EmbeddingStore:
    """
    A vector store for text chunks.

    Tries to use ChromaDB if available; falls back to an in-memory store.
    The embedding_fn parameter allows injection of mock embeddings for tests.
    """

    def __init__(
        self,
        collection_name: str = "documents",
        embedding_fn: Callable[[str], list[float]] | None = None,
    ) -> None:
        self._embedding_fn = embedding_fn or _mock_embed
        self._collection_name = collection_name
        self._use_chroma = False
        self._store: list[dict[str, Any]] = []
        self._collection = None
        self._next_index = 0

        try:
            import chromadb  # noqa: F401

            client = chromadb.Client()
            self._collection = client.get_or_create_collection(name=self._collection_name)
            self._use_chroma = True
        except Exception:
            self._use_chroma = False
            self._collection = None

    def _make_record(self, doc: Document) -> dict[str, Any]:
        embedding = self._embedding_fn(doc.content)
        metadata = dict(doc.metadata) if doc.metadata else {}
        metadata["doc_id"] = doc.id
        return {
            "id": doc.id,
            "content": doc.content,
            "metadata": metadata,
            "embedding": embedding
        }

    def _matches_filter(self, metadata: dict, filter_dict: dict) -> bool:
        if not filter_dict:
            return True
        for k, v in filter_dict.items():
            if metadata.get(k) != v:
                return False
        return True

    def _search_records(self, query: str, records: list[dict[str, Any]], top_k: int) -> list[dict[str, Any]]:
        if not records:
            return []
        
        query_emb = self._embedding_fn(query)
        results = []
        for rec in records:
            score = compute_similarity(query_emb, rec["embedding"])
            results.append({
                "id": rec["id"],
                "content": rec["content"],
                "metadata": rec["metadata"],
                "score": score
            })
            
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

    def add_documents(self, docs: list[Document]) -> None:
        if self._use_chroma:
            ids = []
            documents = []
            embeddings = []
            metadatas = []
            for doc in docs:
                rec = self._make_record(doc)
                ids.append(rec["id"])
                documents.append(rec["content"])
                embeddings.append(rec["embedding"])
                metadatas.append(rec["metadata"])
            self._collection.add(
                ids=ids,
                documents=documents,
                embeddings=embeddings,
                metadatas=metadatas
            )
        else:
            for doc in docs:
                rec = self._make_record(doc)
                self._store.append(rec)

    def search(self, query: str, top_k: int = 5) -> list[dict[str, Any]]:
        if self._use_chroma:
            all_data = self._collection.get(include=["documents", "metadatas", "embeddings"])
            records = []
            if all_data and all_data.get("ids"):
                for i in range(len(all_data["ids"])):
                    records.append({
                        "id": all_data["ids"][i],
                        "content": all_data["documents"][i],
                        "metadata": all_data["metadatas"][i],
                        "embedding": all_data["embeddings"][i]
                    })
            return self._search_records(query, records, top_k)
        else:
            return self._search_records(query, self._store, top_k)

    def get_collection_size(self) -> int:
        if self._use_chroma:
            return self._collection.count()
        return len(self._store)

    def search_with_filter(self, query: str, top_k: int = 3, metadata_filter: dict = None) -> list[dict]:
        if metadata_filter is None:
            metadata_filter = {}
            
        if self._use_chroma:
            all_data = self._collection.get(include=["documents", "metadatas", "embeddings"])
            records = []
            if all_data and all_data.get("ids"):
                for i in range(len(all_data["ids"])):
                    records.append({
                        "id": all_data["ids"][i],
                        "content": all_data["documents"][i],
                        "metadata": all_data["metadatas"][i],
                        "embedding": all_data["embeddings"][i]
                    })
            filtered_records = [r for r in records if self._matches_filter(r["metadata"], metadata_filter)]
            return self._search_records(query, filtered_records, top_k)
        else:
            filtered_records = [r for r in self._store if self._matches_filter(r["metadata"], metadata_filter)]
            return self._search_records(query, filtered_records, top_k)

    def delete_document(self, doc_id: str) -> bool:
        if self._use_chroma:
            all_data = self._collection.get(where={"doc_id": doc_id})
            if all_data and all_data.get("ids") and len(all_data["ids"]) > 0:
                self._collection.delete(where={"doc_id": doc_id})
                return True
            return False
        else:
            initial_len = len(self._store)
            self._store = [r for r in self._store if r["metadata"].get("doc_id") != doc_id]
            return len(self._store) < initial_len
