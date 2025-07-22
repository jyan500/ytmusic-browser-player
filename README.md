# ytmusic-browser-player
* Manifest V3 chrome extension to play songs, search, add/edit/delete playlists from your youtube music account.
* Uses chrome's offscreen document API to allow audio playback while the extension window is in the background for continuous background playback.
* Requires you to have a open or background chrome tab that is on music.youtube.com for authentication. Must also be logged into music.youtube.com.
* Stack: Flask, [ytMusicApi](https://ytmusicapi.readthedocs.io/en/stable/), [pytubefix](https://pytubefix.readthedocs.io/en/latest/), React, Typescript

# sources
https://medium.com/@tharshita13/creating-a-chrome-extension-with-react-a-step-by-step-guide-47fe9bab24a1
https://github.com/arikw/chrome-extensions-reloader?tab=readme-ov-file
https://blog-aditya.hashnode.dev/learn-how-to-create-a-chrome-extension-using-webpack-react-and-tailwind-css
https://github.com/kelsonpw/react-chrome-extension-router
https://blog.logrocket.com/building-audio-player-react/