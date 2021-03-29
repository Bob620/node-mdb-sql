const fs = require('fs/promises');
const path = require('path');

const bent = require('bent')('buffer');
const extract = require('extract-zip');

const pack = require('./package.json');

async function get(uri) {
	try {
		await fs.writeFile('./prebuilt.zip', await bent(uri));
		await extract('./prebuilt.zip', {
			dir: path.resolve('./')
		});
		await fs.unlink('./prebuilt.zip');
		await fs.chmod('./mdb-sql', 777);
	} catch(err) {
		if (err.statusCode === 302)
			return await get(err.headers.location);
		console.log(err);
	}
}

const uri = `https://github.com/Bob620/node-mdb-sql/releases/download/v${pack.version}/${process.platform}-mdb-sql-prebuilt.zip`;
console.log(`Downloading precompiled mdb-sql at '${uri}'`);
get(uri);
