const express = require("express");
const router = express.Router();

const plc = require("./playlist.controller");


// 플레이리스트에 곡을 제거하는 api
router.delete("/:playlistId/song/delete");
// 플레이리스트의 곡 정보를 가져오는 api
router.post("/:playlistId/song/list");
router.post("/:playlistId/song/:songId");
// 플레이리스트에 곡을 추가하는 api
router.post("/:playlistId/song");

// 플레이리스트에 유저를 초대하는 api
router.post("/:playlistId/member", plc.inviteMember);
// 공유된 플레이리스트에서 나가는 api
router.delete("/:playlistId/member");
// 유저의 플레이리스트의 정보를 가져오는 api
router.get("/list", plc.index);
router.get("/:playlistId", plc.show);
// 플레이리스트를 추가하는 api
router.post("/", plc.add);

module.exports = router;
