import User from "../models/user.model.js";

export async function validateUser(userId) {
  return await User.findById(userId).lean();
}


export async function createOrUpdateGoogleUser({ google_id, email, name, picture }) {
  let user = await User.findOne({ email });

  let isNewUser = false;

  if (!user) {
    isNewUser = true;
    user = new User({
      google_id,
      email,
      name,
      user_photo: picture,
    });
    await user.save();
  } else {
    user.google_id = google_id;
    user.user_photo = picture;
    await user.save();
  }

  return { user, isNewUser };
}
