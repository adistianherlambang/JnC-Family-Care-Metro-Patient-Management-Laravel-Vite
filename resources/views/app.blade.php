<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pelayanan Pasien Ibu & Anak</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    @if (file_exists(public_path('hot')))
        @viteReactRefresh
    @endif
    @vite(['resources/css/index.css', 'resources/js/main.jsx'])
</head>
<body>
    <div id="root"></div>
</body>
</html>