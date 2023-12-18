/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    ...nextConfig, 
    env: {
        BASE_URL: 'http://localhost:5000'
    }
}
