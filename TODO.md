# TODO

- Refresh in-place after editing instead of actually
  reloading the page, so the expanded day is preserved.

- Implement a UI for the addshow API.

- Add epguides.com links? (How to find?)

- Move link patterns into the db instead of hardcoding.

- Display "Today" instead of "Next: (next week)" for
  shows airing on the current day. For shows on break
  returning this day next week, keep them faded out.

- Move next airdate detection into main routine so
  it only has to be calculated once.

    - Move shows whose next airdate is more than 90
      days in the future to the "Future" section.

    - Calculate the weekday if there's an airdate for
      the next episode, but the schedule is missing.

