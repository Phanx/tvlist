# TODO

- Display "Starts" instead of "Returns" for new shows.

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

- Use React animation instead of jQuery?

- Prune unused parts from fetched data?

- Find direct link to show on KAT.

## Build process

- Fix the package.json/scripts/build command?
