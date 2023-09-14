import { parse } from 'csv-parse';
import fs from 'node:fs';

export async function readFile(req, res) {
  let data = ''
  let lineCounter = 0

  req.on('data', (chunk) => {
    data += chunk;
    // Count the number of newline characters to determine the number of lines
    lineCounter += (chunk.toString().match(/\n/g) || []).length;
  });

  req.on('end', async () => {
    try {
      // Create a temporary file to store the uploaded data
      const tempFilePath = 'temp.csv';

      // Convert the data string to a buffer
      const dataBuffer = Buffer.from(data, 'binary');

      // Write the received data buffer to the temporary file
      await fs.promises.writeFile(tempFilePath, dataBuffer);

      const fileStream = fs.createReadStream(tempFilePath);

      console.log({ lineCounter })
      fileStream
        .pipe(parse({
          delimiter: ';',
          skipEmptyLines: true,
          fromLine: 6, // skip the headers line -> 2 for API Clients
          strict: false, // Enable strict mode to catch parsing errors
          relax_quotes: true,
          relax_column_count: true, // tolerates data sets with inconsistent number of fields between records
          to_line: lineCounter - 1,
        }))
        .on('data', async (row) => {
          // Process each row of CSV data and push it to the results array
          const [title, description] = row

          console.log({ row, title, description })

          await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title,
              description,
            })
          })
        })
        .on('end', async () => {
          // Respond to the client
          res.end(JSON.stringify({ message: 'File uploaded and processed successfully.' }));

          // Check if the file exists before attempting to unlink it
          if (await fs.promises.access(tempFilePath).then(() => true).catch(() => false)) {
            await fs.promises.unlink(tempFilePath);
          }
        });
    } catch (error) {
      console.error('Error processing file:', error);

      // Respond with an error status
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  });
}
