// ===== CSV Export =====
export function exportToCSV(data, filename='grocery_list.csv') {
    if(!data || !data.length) return;
    const keys = Object.keys(data[0]);
    const csvRows = [keys.join(',')];

    data.forEach(item=>{
        csvRows.push(keys.map(k=> `"${item[k] || ''}"`).join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden','');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// ===== CSV Import =====
export function importFromCSV(file){
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onload = e=>{
            const text = e.target.result;
            const lines = text.split(/\r?\n/).filter(l=>l.trim()!=='');
            if(lines.length<2) resolve([]);
            const headers = lines[0].split(',');
            const data = lines.slice(1).map(line=>{
                const values = line.split(',');
                const obj = {};
                headers.forEach((h,i)=> obj[h.replace(/"/g,'')] = values[i]?.replace(/"/g,''));
                return obj;
            });
            resolve(data);
        };
        reader.onerror = err => reject(err);
        reader.readAsText(file);
    });
}
