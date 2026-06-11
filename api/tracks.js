import express from "express";
import { getPlaylistsByTrackId } from "#db/queries/playlists";
import { getTracks, getTrackById } from "#db/queries/tracks";
import requireUser from "#middleware/requireUser";

const router = express.Router();
export default router;

router.get("/", async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.param("id", async (req, res, next, id) => {
  const track = await getTrackById(id);
  if (!track) return res.status(404).send("Track not found.");
  req.track = track;
  next();
});

router.get("/:id", (req, res) => {
  res.send(req.track);
});

router.get("/:id/playlists", requireUser, async (req, res) => {
  const playlists = await getPlaylistsByTrackId(req.track.id, req.user.id);
  res.send(playlists);
});