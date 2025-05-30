import { Router } from "express";
import { loginMethod, getTimeToken,updateToken, getAllUsers,getUserByUsername,saveUser, updateUser,deleteUser} from "../controllers/auth_controllers";



const router = Router();

router.post('/login', loginMethod);
router.get('/time/:userID', getTimeToken);
router.put('/update/',updateToken);
router.get("/users",getAllUsers);
router.get("/users/:username", getUserByUsername);
router.post('/create',saveUser);
router.put ('/update/:userID',updateUser);
router.put('/delete/:userID',deleteUser);

export default router;

