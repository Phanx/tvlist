# TODO

- Move next airdate detection into main routine.

- Prune unused data?

- Split up data by day and pass it to a new element
  <ShowGroup name={dayName}> which then fills itself
  with <Show data={show}> elements.

- Implement collapsible <ShowGroup> when clicking
  on its header. Separate <ShowGroupHeader> element?

- Some kind of persistent storage, eg. in a JSON file,
  of basic data like title and last known airday, so
  the <ShowList> can be shown right away, and each
  <Show> can fetch its own JSON and update itself.
