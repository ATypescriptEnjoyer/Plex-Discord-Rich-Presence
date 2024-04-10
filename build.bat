call yarn build
call node --experimental-sea-config sea-config.json
call node -e "require('fs').copyFileSync(process.execPath, 'app.exe')"
call signtool remove /s app.exe
call npx postject app.exe NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2