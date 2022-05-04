@echo off

title Farming build
cargo build --all --target wasm32-unknown-unknown --release
xcopy %CD%\target\wasm32-unknown-unknown\release\market.wasm %CD%\res /Y
pause