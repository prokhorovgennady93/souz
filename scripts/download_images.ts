import { db } from "../src/lib/db";
import fs from "fs";
import path from "path";
import axios from "axios";

async function downloadImages() {
  console.log("Script disabled because Question model no longer has imageUrl.");
}

downloadImages().catch(console.error);
