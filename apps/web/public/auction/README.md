# Survivor Auction assets

Drop files here and they'll be served from the site root under `/auction/...`.

## Theme music

Add an audio file named exactly:

```
survivor-theme.mp3
```

The "Play theme music" button on `/auction` will play it (loops automatically).
If it's missing, the page shows a small hint instead of erroring.

> Heads up: the real Survivor theme is copyrighted. Fine for a private family
> reunion, but don't deploy it publicly. A royalty-free "tribal/jungle" track
> works great too.

## Soundboard clips

The soundboard buttons look for short clips in `public/auction/sfx/`, named
exactly (MP3):

| Button                               | File                        |
| ------------------------------------ | --------------------------- |
| Welcome to this season of Survivor   | `welcome.mp3`               |
| Come on in, guys!                    | `come-on-in.mp3`            |
| Wanna know what you're playing for?  | `playing-for.mp3`           |
| Worth playing for?                   | `worth-playing-for.mp3`     |
| Dig deep!                            | `dig-deep.mp3`              |
| Survivors ready…                     | `survivors-ready.mp3`       |
| GO!                                  | `go.mp3`                    |
| Wow!                                 | `wow.mp3`                   |
| Applause                             | `applause.mp3`              |
| The tribe has spoken                 | `tribe-has-spoken.mp3`      |

Missing clips show greyed-out on the page with a hint — add the file and the
button lights up. Clips auto-duck the theme music while they play. (Same
copyright caveat as the theme: fine for a private reunion, not for public deploy.)

## Family photos

Add image files (jpg/png/webp), e.g.:

```
grandma.jpg
uncle-rob.png
```

Then in the auction page, when you Add/Edit a contestant, set the photo path to
match, e.g. `/auction/grandma.jpg`. No photo? The card shows the person's
initials on a fiery gradient instead.
