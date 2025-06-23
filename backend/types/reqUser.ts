import { Request } from "express";
import passport from "passport";

export interface reqUser extends Request {
  user: {
    displayName: string;
    emails: { value: string; verified: boolean }[];
    photos: { value: string }[];
    uid: string;
  };
}