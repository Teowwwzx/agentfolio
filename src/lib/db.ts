import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL!, {
  max: 10, // Use a conservative connection pool
  idle_timeout: 20,
  connect_timeout: 10,
})

export default sql
