# TODO

- If db is empty on first run, populate from shows.json.

- Implement a UI for the addshow API.

- Use IDs in db to construct IMDB and KAT links.

- Add epguides.com links? (How to find?)

- Move link patterns into the db instead of hardcoding.

- Use db "pref" data when constructing links.

- Use reponsive classes to hide info-only links if the
  screen is too small to fit them all.

- Move fetching into the server API

    - Store relevant data from TVmaze in the db. Keep a
      timestamp for the last update for each show. Only
      fetch new data from TVmaze if it's been more than
      72 hours or if the saved next airdate has passed.

    - Use http.request instead of jQuery for fetching.

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

## Build process

- Fix the package.json/scripts/build command?

