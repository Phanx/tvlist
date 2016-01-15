# TODO

- Display "Starts" instead of "Returns" for new shows.

- Prefer names as written in shows.json.

- Use IDs in shows.json to construct IMDB and KAT links.

- Add epguides.com links.

- Use reponsive classes to hide info-only links if the
  screen is too small to fit them all.

- Move next airdate detection into main routine so
  it only has to be calculated once.

    - Calculate the weekday if there's an airdate for
      the next episode, but the schedule is missing.

    - Automatically discard ended shows on fetch.

    - Move "On Break" shows with no airdates to the
      "Unknown" section.

    - Move shows whose next airdate is more than 90
      days in the future to the "Unknown" section.

    - Rename "Unknown" to "On Break" ?

    - Hide day sections with no shows? Or fade them
      out so it's obvious they're not clickable.

- Move fetching into the server API

- Use React animation instead of jQuery?

- Prune unused parts from fetched data?

## Build process

- Fix the package.json/scripts/build command?
