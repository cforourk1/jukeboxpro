import express from "express";


import {
  createPlaylist,
  getPlaylistById,
  getPlaylists,
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";

import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
const router = express.Router();
export default router;


router.use(requireUser);



router.get("/", async (req, res) => {
  const playlists = await getPlaylists(req.user.id);
  res.send(playlists);
});

router.post("/", async (req, res) => {
  if (!req.body) return res.status(400).send("Request body is required.");

  const { name, description } = req.body;
  if (!name || !description)
    return res.status(400).send("Request body requires: name, description");

  const playlist = await createPlaylist(name, description, req.user.id);
  res.status(201).send(playlist);
});

router.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(404).send("Playlist not found.");

  req.playlist = playlist;
  next();
});

router.get("/:id", (req, res) => {
  if (req.playlist.user_id !== req.user.id) return res.status(403).send("Forbidden.");
  res.send(req.playlist);
});


router.get("/:id/tracks", async (req, res) => {
  if (req.playlist.user_id !== req.user.id) return res.status(403).send("Forbidden.");
  const tracks = await getTracksByPlaylistId(req.playlist.id);
  res.send(tracks);
});

router.post("/:id/tracks", async (req, res) => {
  if (!req.body) return res.status(400).send("Request body is required.");
  const { trackId } = req.body;
  if (!trackId) return res.status(400).send("Request body requires: trackId");
  if (req.playlist.user_id !== req.user.id) return res.status(403).send("Forbidden.");
  const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
  res.status(201).send(playlistTrack);
});
