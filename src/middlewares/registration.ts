import express, { Request, Response } from 'express';
import crypto from 'node:crypto';
import pool from '../database/queryDB';

// @todo move to dedicated declaration file
interface User {
  id: string;
  username: string;
  api_key: string;
}

async function createUser(username: string, req: Request): Promise<User> {
  const apiKey = crypto.randomUUID();

  const values = [username, apiKey];
  const sql =
    'INSERT INTO users (username, api_key) VALUES ($1, $2) RETURNING *';

  const user = await pool.query(sql, values);

  return user.rows[0];
}

export default createUser
