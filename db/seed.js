import db from "#db/client";
import { faker } from "@faker-js/faker";
import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user1 = await createUser(faker.internet.username(), "password12345");
  const user2 = await createUser(faker.internet.username(), "password123");

  for (let i = 0; i < 20; i++) {
    await createTrack(
      faker.music.songName(),
      faker.number.int({ min: 120000, max: 360000 })
    );
  }

  for (let i = 0; i < 5; i++) {
    await createPlaylist(faker.word.words(3), faker.lorem.sentence(), user1.id);
    await createPlaylist(faker.word.words(3), faker.lorem.sentence(), user2.id);
  }

  for (let i = 1; i <= 15; i++) {
    const trackId = 1 + Math.floor(Math.random() * 20);
    const playlistId = 1 + Math.floor(Math.random() * 10);
    await createPlaylistTrack(playlistId, trackId);
  }
}

