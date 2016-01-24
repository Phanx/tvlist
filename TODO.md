# TODO

- Implement a UI for the addshow API.

- Add epguides.com links? (How to find?)

- Move link patterns into the db instead of hardcoding.

- Move next airdate detection into main routine so
  it only has to be calculated once.

    - Calculate the weekday if there's an airdate for
      the next episode, but the schedule is missing.

    - Automatically discard ended shows on fetch?
      **NO.** Add an "Ended" section after "Unknown"
      and a UI for removing them manually.

    - Move shows whose next airdate is more than 90
      days in the future to the "Unknown" section.

    - Rename "Unknown" to "On Break" ?

    - Hide day sections with no shows? Or fade them
      out so it's obvious they're not clickable.

