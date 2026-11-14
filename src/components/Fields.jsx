import { useEffect, useId, useState } from "react";
import { airportLabel, findAirport, suggestAirports } from "../inventory.js";

export function Stepper({ label, hint, value, min, max, onChange }) {
  return (
    <div className="stepper">
      <div>
        <strong>{label}</strong>
        {hint ? <small>{hint}</small> : null}
      </div>
      <div className="stepper-controls">
        <button type="button" aria-label={`Fewer ${label}`} onClick={() => onChange(value - 1)} disabled={value <= min}>
          −
        </button>
        <span>{value}</span>
        <button type="button" aria-label={`More ${label}`} onClick={() => onChange(value + 1)} disabled={value >= max}>
          +
        </button>
      </div>
    </div>
  );
}

export function DateField({ label, value, onChange, min, disabled }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="date"
        value={value}
        min={min || undefined}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export function CityField({ label, code, onSelect }) {
  const id = useId();
  const [text, setText] = useState(() => airportLabel(code));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (code) setText(airportLabel(code));
  }, [code]);

  const selectedLabel = airportLabel(code);
  const options = suggestAirports(text === selectedLabel ? "" : text);

  function choose(airport) {
    onSelect(airport.code);
    setText(airportLabel(airport.code));
    setOpen(false);
  }

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder="City or airport"
        value={text}
        onFocus={(event) => {
          setOpen(true);
          event.target.select();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        onBlur={() => {
          const match = findAirport(text);
          if (match && (text.trim().length >= 3 || match.code.toLowerCase() === text.trim().toLowerCase())) {
            onSelect(match.code);
            setText(airportLabel(match.code));
          }
          setOpen(false);
        }}
        onChange={(event) => {
          const next = event.target.value;
          setText(next);
          setOpen(true);
          const match = findAirport(next);
          const exact =
            match &&
            [match.code, match.city, `${match.city} (${match.code})`].some(
              (item) => item.toLowerCase() === next.trim().toLowerCase(),
            );
          onSelect(exact ? match.code : "");
        }}
      />
      {open && (
        <ul className="menu" role="listbox">
          {options.length === 0 && <li className="menu-empty">No matching city</li>}
          {options.map((airport) => (
            <li key={airport.code}>
              <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => choose(airport)}>
                <strong>{airport.city}</strong>
                <span className="code">{airport.code}</span>
                <small>{airport.airport}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SuggestField({ label, value, onChange, options, placeholder }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const needle = value.trim().toLowerCase();
  const matches = options.filter((option) => !needle || option.toLowerCase().includes(needle)).slice(0, 8);

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onChange={(event) => onChange(event.target.value)}
      />
      {open && matches.length > 0 && (
        <ul className="menu" role="listbox">
          {matches.map((option) => (
            <li key={option}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
