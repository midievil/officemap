<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="">
        <meta name="author" content="">
        <link rel="icon" href="/favicon.ico">

        <title>MMTR office map</title>

        <!-- Bootstrap core CSS -->
        <link href="/dist/css/bootstrap.min.css" rel="stylesheet">

        <!-- Custom styles for this template -->
        <link href="/css/main.css?v=<?=$scriptVersion?>" rel="stylesheet">
    </head>

    <body>

  
  <?
    $menuItem = 'report';
    require('views/menu.html.php');

    global $queryParams;
  ?>

    <div class="container">
      <div id="divReport" class='<?=$queryParams?>'>
          <div class='buttons'>
              <button class="btn" id="btnPrint" onclick='printReport();'>Печать</button>
          </div>
      
          <div class='content'></div>
      </div>
    </div>


    <script src="/dist/js/jquery-3.3.1.min.js"></script>
    <script src="/dist/js/popper.min.js"></script>
    <script src="/dist/js/bootstrap.min.js"></script>
    <script src="/js/report.js"></script>

    <script>
        var reportId = '<?=$queryParams?>';        
    </script>
    </body>

</html>