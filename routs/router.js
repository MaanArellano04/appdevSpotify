const express = require('express');
const router = express.Router();
const mControl = require('../controller/sControl.js');

router.get('/', mControl.getMusicList);
router.get('/index',mControl.getMusicList );
router.post('/addsongs', mControl.uploadMusic); //insert sa database
router.get('/addsongs', mControl.renderAddMusicPage); //to view lng ang page
router.get('/updatemusic/:id', mControl.getUpdateSong); //get info para sa update
router.post('/updatemusic/:id', mControl.updateSong); //to update song
router.post('/delete/:id', mControl.deleteSong);
router.post('/add-to-playlist', mControl.addToPlaylist);

router.get('/playlistmusic', mControl.renderPlaylistPage);


router.get('/playmusic/:id', mControl.getSongDetails); 

router.get('/playplaylistmusic/:id', mControl.getSongPlaylist); 
router.get('/playlistmusic/:playlistId', mControl.getPlaylist);
router.post('/removeplaylist/:id', mControl.removePlaylist);




module.exports = router;