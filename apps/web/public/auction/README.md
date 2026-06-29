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
| Come on in, guys!                    | `come-on-in.mp3`            |
| Wanna know what you're playing for?  | `playing-for.mp3`           |
| Survivors ready…                     | `survivors-ready.mp3`       |
| GO!                                  | `go.mp3`                    |
| Wow!                                 | `wow.mp3`                   |
| Applause                             | `applause.mp3`              |
| The tribe has spoken                 | `tribe-has-spoken.mp3`      |

### Torch-snuff sound

When a player's balance hits $0, the page auto-plays `sfx/snuff.mp3` (a torch
extinguish / whoosh). If that file is missing it falls back to
`tribe-has-spoken.mp3`, so there's always *something*. Drop in a `snuff.mp3` for
the real effect.

Missing clips show greyed-out on the page with a hint — add the file and the
button lights up. Clips auto-duck the theme music while they play. (Same
copyright caveat as the theme: fine for a private reunion, not for public deploy.)

## Family photos

The page seeds a default roster on first load. Each default player looks for a
photo at `/auction/<firstname>.jpg` (lowercase). Drop these files in to give
everyone a profile pic — missing ones fall back to initials automatically:

```
mom.jpg      dad.jpg      jeff.jpg     shaylee.jpg
reese.jpg    shane.jpg    kelton.jpg   harper.jpg
miles.jpg    marissa.jpg  deion.jpg    hailey.jpg
josh.jpg     heather.jpg  ryan.jpg     lena.jpg
malina.jpg   jake.jpg
```

For anyone you add yourself, set the photo path in the Add/Edit form, e.g.
`/auction/grandma.jpg`. No photo? The card shows the person's initials on a
fiery gradient instead.

> The roster is editable: remove/add/edit anyone on the page. Use **Restore
> default players** to bring the original list back.
