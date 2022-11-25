import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import spotifyWebApi from "spotify-web-api-node";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

dotenv.config({ path: ".env.local" });

const app = express();
const port = 5000;

const spotifyApi = new spotifyWebApi({
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});
const generateRandomString = function (length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/auth/login", (req, res) => {
  const scope = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "playlist-read-private",
    "playlist-read-collaborative ",
    "user-library-read ",
    "user-follow-read",
    "user-top-read",
  ];

  //  a randomly generated string to protect against attacks such as cross-site request forgery.
  const state = generateRandomString(16);
  const authorizeURL = spotifyApi.createAuthorizeURL(scope, state);

  if (!authorizeURL) {
    return res.status(400).json({
      msg: "Invalid AuthorizeURL!",
    });
  }

  res.status(200).json({
    url: authorizeURL,
  });
});

app.post("/auth/token", async (req, res) => {
  const code = req.body.code;
  try {
    const { body } = await spotifyApi.authorizationCodeGrant(code);

    if (!body) {
      res.status(401).json({
        msg: "Invalid Code, Unauthorized!",
      });
    }

    res.cookie("refreshToken", body.refresh_token, {
      httpOnly: true,
      maxAge: 7 * 60 * 60 * 1000,
    });

    res.json({
      accessToken: body.access_token,
      expiresIn: body.expires_in,
      refreshToken: body.refresh_token,
      scope: body.scope,
      tokenType: body.token_type,
    });
  } catch (err) {
    res.status(401).json({
      msg: "Unauthorized!",
    });
  }
});

app.get("/auth/refresh-token", async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(403).json({
      msg: "Invalid RefreshToken!",
    });
  }
  spotifyApi.setRefreshToken(refreshToken);
  const { body } = await spotifyApi.refreshAccessToken();

  res.json({
    accessToken: body.access_token,
    expiresIn: body.expires_in,
    scope: body.scope,
    tokenType: body.token_type,
  });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
