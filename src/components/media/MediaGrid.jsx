import { MediaCard } from "./MediaCard";
import { EmptyState } from "../common/EmptyState";
import "./MediaGrid.css";

export function MediaGrid({ items, isWatched, emptyTitulo, emptyMensagem }) {
  if (items.length === 0) {
    return <EmptyState icone="🎬" titulo={emptyTitulo} mensagem={emptyMensagem} />;
  }

  return (
    <div className="media-grid">
      {items.map((item) => (
        <MediaCard key={`${item.tipo}-${item.id}`} item={item} watched={isWatched?.(item.tipo, item.id)} />
      ))}
    </div>
  );
}
