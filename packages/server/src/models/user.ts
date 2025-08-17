import { compare, genSalt, hash } from "bcrypt";
import { Schema, Types, model } from "mongoose";

export enum AppRoles {
  ADMIN = "Admin",
  STANDARD = "Standard",
}

export type Token = {
  token: string;
  location: string;
  createdAt: string;
};

// Document interface - internal MongoDB type
export interface UserDocument extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  verified: boolean;
  tokens: Token[];
  roles: AppRoles[];
  createdAt: string;
  updatedAt: string;
  toClient(): User;
  comparePassword(password: string): Promise<boolean>;
}

// Client interface - what gets sent to the client
export interface User {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  roles: AppRoles[];
  createdAt: string;
  updatedAt: string;
}

export interface UserWithLogs extends User {
  authTokens: {
    token: string,
    location: string,
    createdAt: string,
  }[],
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  profile: User;
  tokens: AuthTokens;
}

export interface AuthState {
  profile: User | null;
  tokens: AuthTokens | null;
  loading: boolean;
  error: string | null;
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    tokens: {
      type: [
        {
          token: String,
          location: String,
          createdAt: String,
        },
      ],
      default: [],
    },
    roles: {
      type: [String],
      enum: Object.values(AppRoles),
      default: [AppRoles.STANDARD],
    }
  },
  { timestamps: true },
);

// Add toClient method to transform document to client format
userSchema.methods.toClient = function (): User {
  return {
    id: this._id.toString(),
    email: this.email,
    name: this.name,
    verified: this.verified,
    roles: this.roles,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return await compare(password, this.password);
};

const UserModel = model("Users", userSchema);

export default UserModel;
