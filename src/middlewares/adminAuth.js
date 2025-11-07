export function adminAuth(req, res, next) {
  const token = "XYZnnn";

  if (token === "XYZ") {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}
