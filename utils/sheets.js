// Google Sheets Configuration
const SPREADSHEET_ID = '1dLbutV0ltFQGBYzqv0F-u_c04C3D4YzYKHKZljtaJvQ'; // Add your spreadsheet ID here
const SHEET_NAME = 'fleet'; // The name of your sheet

async function fetchCarsData() {
    try {
        // Using the public JSON endpoint of published Google Sheets
        const response = await fetch(`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`);
        const text = await response.text();
        
        // Clean the response (remove the google.visualization.Query.setResponse wrapper)
        const jsonString = text.substring(47, text.length - 2);
        const data = JSON.parse(jsonString);
        
        // Extract headers and rows
        const headers = data.table.cols.map(col => col.label);
        const rows = data.table.rows;
        
        // Transform the data into our cars array format
        return rows.map((row, index) => {
            const values = row.c.map(cell => cell ? cell.v : '');            // Validate badge against allowed values
            const allowedBadges = ['Land Rover', 'Lamborghini', 'Rolls Royce', 'Mercedes', 'BYD', 'BMW'];
            const badge = values[4] || '';
            const validatedBadge = allowedBadges.includes(badge) ? badge : '';

            return {
                id: index + 1,
                name: values[0],
                type: values[1],
                description: values[2],
                image: values[3],
                badge: validatedBadge,
                specs: {
                    speed: values[5],
                    hp: values[6],
                    fuel: values[7],
                    acceleration: values[8]
                },
                price: values[9],
                extraImages: values.slice(10).filter(url => url && url.trim() !== '')
            };
        });
    } catch (error) {
        console.error('Error fetching cars data:', error);
        return [];    }
}
