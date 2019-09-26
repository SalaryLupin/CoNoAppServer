const express = require("express");
const router = express.Router();

const plc = require("./playlist.controller");
const sc = require("./song.controller")


// 유저가 플레이리스트를 가지고 있는지 확인
router.use("/:playlistId", plc.getPlaylist)

// 플레이리스트에 곡을 제거하는 api
router.delete("/:playlistId/song", sc.delete);
// 플레이리스트의 곡 정보를 가져오는 api
router.get("/:playlistId/song/", sc.list);
router.get("/:playlistId/song/:songId", sc.show);
// 플레이리스트에 곡을 추가하는 api
router.post("/:playlistId/song", sc.add);

// 플레이리스트 유저 목록을 보는 api
router.get("/:playlistId/member", plc.listMember);
// 플레이리스트에 유저를 초대하는 api
router.post("/:playlistId/member", plc.inviteMember);
// 공유된 플레이리스트에서 나가는 api
router.delete("/:playlistId/member", plc.leavePlaylist);
// 유저의 플레이리스트의 정보를 가져오는 api
router.get("/", plc.index);
router.get("/:playlistId", plc.show);
// 플레이리스트를 추가하는 api
router.post("/", plc.add);

module.exports = router;
