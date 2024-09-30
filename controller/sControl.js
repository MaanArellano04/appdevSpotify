const path = require('path');
const musicModel = require('../models/Infor.js');
const multer = require('multer');
const { exit } = require('process');

//kukunin lahat ng list ng nasa database
const getMusicList = (req, res) => {
    musicModel.getAllMusic((err, results) => {
        if (err) {
            return res.status(500).send('Error retrieving music from the database');
        }
        res.render('index', { musicList: results }); 
    });
};


// to view and addsongs.ejs
const renderAddMusicPage = (req, res) => {
    res.render('addsongs');
};


//get the info ng songpara kay music play
const getSongDetails = (req, res) => {
    const songId = req.params.id; 
    musicModel.getMusicById(songId, (err, song) => {
        if (err || !song) {
            return res.status(404).send('Song not found');
        }
        res.render('playmusic', { song: song }); 
    });
};

const getSongPlaylist = (req, res) => {
    const songId = req.params.id; 
    musicModel.getMusicById(songId, (err, song) => {
        if (err || !song) {
            return res.status(404).send('Song not found');
        }
        res.render('playplaylistmusic', { song: song }); 
    });
};


//to update the song
const updateSong = (req, res) => {
    const songId = req.params.id; 
    const song_name = req.body.song_name; 
    const author = req.body.author;
    const lyrics = req.body.lyrics;

    console.log(songId, song_name, author, lyrics);

    musicModel.updateSong(songId, { song_name, author, lyrics })
        .then(() => {
            res.redirect(`/playmusic/${songId}`); // to redirect the song after magupdate
        })
        .catch((err) => {
            console.error('Error updating song:', err); 
            res.status(500).send('Error updating music in the database');
        });
};




//get info to update
const getUpdateSong = (req, res) => {
    const songId = req.params.id;

    musicModel.getMusicById(songId, (err, song) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving song');
        }
        if (!song) {
            return res.status(404).send('Song not found');
        }
        res.render('updatemusic', { song }); 
    });
};




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      
        if (file.fieldname === 'music') {
            cb(null, './public/music'); 
        } else if (file.fieldname === 'picture') {
            cb(null, './public/images'); 
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 } 
}).fields([
    { name: 'music', maxCount: 1 },
    { name: 'picture', maxCount: 1 }
]);


// post or add sa database ng song
const uploadMusic = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        const songName = req.body.song_name;
        const author = req.body.author;
        const lyrics = req.body.lyrics;
        const musicFilePath = `music/${req.files.music[0].filename}`; 
let pictureFilePath = null;

if (req.files.picture) {
    pictureFilePath = `images/${req.files.picture[0].filename}`;
}


        musicModel.insertMusic({ songName, author, musicFilePath, pictureFilePath, lyrics }, (err) => {
            if (err) {
                return res.status(500).send('Error saving music to the database');
            }
            res.redirect('/'); 
        });
    });
};



const deleteSong = (req, res) => {
    const songId = req.params.id;

    musicModel.deleteSong(songId, (err) => {
        if (err) {
            console.error('Error deleting song:', err);
            return res.status(500).send('Error deleting song from the database');
        }
        res.redirect('/index'); 
    });
};













// Controller to add song to playlist
const addToPlaylist = (req, res) => {
    const songId = req.body.song_id; 
    musicModel.addToPlaylist(songId)
        .then(() => {
            console.log("Song added to playlist successfully.");
            res.redirect(`/playmusic/${songId}`); 
        })
        .catch(err => {
            console.error("Error adding song to playlist:", err);
            res.status(500).send("Error adding song to playlist");
        });
};

// musicController.js

const renderPlaylistPage = (req, res) => {
    musicModel.getSongsplaylist((err, results) => {
        if (err) {
            console.error('Error retrieving music from the database:', err); 
            return res.status(500).send('Error retrieving music from the database');
        }
        res.render('playlistmusic', { musicList: results }); 
    });
};




const getPlaylist = (req, res) => {
    const playlistId = req.params.playlistId; 
    musicModel.getSongsByPlaylistId(playlistId, (err, songs) => {
        if (err) {
            return res.status(500).send('Error retrieving playlist data');
        }
        res.render('playplaylistmusic', { songs }); 
    });
};

const removePlaylist = (req, res) => {
    const songId = req.params.id; 
    musicModel.removePlaylist(songId, (err, result) => {
        if (err) {
            console.error('Error deleting song:', err);
            return res.status(500).send('Error deleting song from the database');
        }
        res.redirect('/playlistmusic'); 
    });
};


module.exports = { uploadMusic, getMusicList, renderAddMusicPage, getSongDetails, updateSong, addToPlaylist, getUpdateSong, deleteSong, renderPlaylistPage, getPlaylist,removePlaylist, getSongPlaylist };