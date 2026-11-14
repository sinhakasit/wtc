import { inr } from "../format.js";

export function Receipt({ title, when, parts, priced, travelersLabel, eyebrow = "Your trip" }) {
  return (
    <aside className="summary">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="when">{when}</p>
      {travelersLabel ? <p className="when">{travelersLabel}</p> : null}
      <ul className="parts">
        {parts.map((part) => (
          <li key={`${part.label}-${part.detail}`}>
            <strong>{part.label}</strong>
            <span>{part.detail}</span>
          </li>
        ))}
      </ul>
      <dl className="totals">
        <div>
          <dt>Fare</dt>
          <dd>{inr(priced.base)}</dd>
        </div>
        <div>
          <dt>Taxes</dt>
          <dd>{inr(priced.taxes)}</dd>
        </div>
        <div>
          <dt>Convenience fee</dt>
          <dd>{inr(priced.fee)}</dd>
        </div>
        <div className="grand">
          <dt>Total</dt>
          <dd>{inr(priced.total)}</dd>
        </div>
      </dl>
    </aside>
  );
}
