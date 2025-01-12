const { google } = require("googleapis");
import * as jwt from "jsonwebtoken";

export const getOAuth2Instance = () => {
	return new google.auth.OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		`${process.env.BACKEND_URL}/auth/google/callback`
	);
};

export const getGoogleAuthorizationRoute = () => {
	const oauth2Client = getOAuth2Instance();
	
	const scopes = [
		"email",
		"profile",
		"https://www.googleapis.com/auth/calendar.readonly",
	];
	const url = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: scopes,
	});
	return url;
};
export type IdTokenParsed = {
	email: string;
	name: string;
	picture?: string;
};
export const getUserDetailFromIdToken = (
	idToken: string
): { name?: string; photoUrl?: string; email: string } => {
	const {
		name,
		picture: photoUrl,
		email,
	} = jwt.decode(idToken) as IdTokenParsed;
	return {
    photoUrl,
		name,
		email,
	};
};