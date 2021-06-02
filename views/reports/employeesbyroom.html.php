        <style>
            
            .print table tr td, .print table tr th {
                border-left: 1px solid black;
                border-top: 1px solid black;
                padding: 3px;
                font-family: Arial;
            }

            .print table {
                border-right: 1px solid black;
                border-bottom: 1px solid black;
                font-size: 10pt;
            }

            table th {
                width: 33%;
            }

        </style>

        <table cellspacing="0" cellpadding="0" class="table table-hover table-sm table-bordered">
            <thead>
                <tr>
                    <th scope="col" class="name">Кабинет</th>
                    <th scope="col" class="comment">Комментарий</th>
                    <th scope="col" class="count">Кол-во сотрудников</th>
                </tr>
            </thead>
<?

        global $reportItems;
        $count = 0;
        foreach($reportItems as $item) {
            $count += $item['employees_count'];
?>
            <tr>
                <td><?=$item['name']?></td>
                <td><?=$item['description']?></td>
                <td><?=$item['employees_count']?></td>
            </tr>
<?
        }

?>

            <tr>
                <th colspan="2">ИТОГО</th>
                <th><?=$count?></th>
            </tr>

        </table>