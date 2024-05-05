rm -rf cjs esm \
&& npx tsc --project tsconfig.cjs.json \
&& (npx tsc --project tsconfig.json || true) \
&& echo '{
	"type": "module"
}' > esm/package.json

