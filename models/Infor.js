const db = require('../config/db');

exports.getAllMusic = (callback) => {
    const query = 'SELECT * FROM music';
    db.query(query, (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};


exports.insertMusic = ({ songName, author, musicFilePath, pictureFilePath, lyrics }, callback) => {
    const query = 'INSERT INTO music (path, title, artist, cover, lyrics) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [musicFilePath, songName, author, pictureFilePath, lyrics], (err, results) => {
        callback(err, results);
    });
};


exports.getMusicById = (id, callback) => {
    const query = 'SELECT * FROM music WHERE id = ?'
    db.query(query, [id], (err, results) => {
        if (err) return callback(err, null);
        callback(null, results[0]); 
    });
};


exports.updateSong = (songId, updatedData) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE music SET title = ?, artist = ?, lyrics = ? WHERE id = ?';
        const params = [updatedData.song_name, updatedData.author, updatedData.lyrics, songId];

        db.query(sql, params, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return reject(err);
            }
            resolve(results); 
        });
    });
};



exports.addToPlaylist = (song_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO playlist (song_id) VALUES (?)';
        db.query(sql, [song_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};




exports.deleteSong = (songId, callback) => {
    const deleteFromPlaylistQuery = `DELETE FROM playlist WHERE song_id = ?`;
    db.query(deleteFromPlaylistQuery, [songId], (err) => {
        if (err) {
            console.error('Error deleting from playlist table:', err);
            return callback(err); 
        }
        console.log('Deleted from playlist');

        const deleteFromMusicFilesQuery = `DELETE FROM music WHERE id = ?`;
        db.query(deleteFromMusicFilesQuery, [songId], (err) => {
            if (err) {
                console.error('Error deleting from music files:', err);
                return callback(err); 
            }
            console.log('Deleted from music');
            callback(null); 
        });
    });
};












exports.getSongsByPlaylistId = (playlistId, callback) => {
    if (typeof callback !== 'function') {
        throw new Error('Callback is not a function');
    }

    const query = 'SELECT * FROM playlist WHERE playlist_id = ?';
    connection.query(query, [playlistId], (error, results) => {
        if (error) {
            console.error('Query error:', error);
            return callback(error);
        }
        callback(null, results);
    });
};

exports.getSongsplaylist = (callback) => {
    const query = `
    SELECT mf.id, mf.title, mf.artist, mf.cover
    FROM playlist AS pt 
    JOIN music AS mf ON pt.song_id = mf.id;`; // Removed the unnecessary comma and WHERE clause
    db.query(query, (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};


exports.removePlaylist = (id, callback) => {
    const query = 'DELETE FROM playlist WHERE song_id = ?';

    db.query(query, [id], (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};

    // Additional methods for adding/updating/deleting songs can go here