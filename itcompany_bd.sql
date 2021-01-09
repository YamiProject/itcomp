-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Дек 02 2020 г., 10:33
-- Версия сервера: 10.3.22-MariaDB
-- Версия PHP: 7.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `itcompany_bd`
--

-- --------------------------------------------------------

--
-- Структура таблицы `modules`
--

CREATE TABLE `modules` (
  `module_id` int(11) NOT NULL,
  `pl_id` int(11) NOT NULL,
  `module_name` varchar(250) NOT NULL,
  `module_page` text NOT NULL,
  `module_img` text NOT NULL,
  `module_file` text NOT NULL,
  `module_info` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `modules`
--

INSERT INTO `modules` (`module_id`, `pl_id`, `module_name`, `module_page`, `module_img`, `module_file`, `module_info`) VALUES
(1, 1, 'Калькулятор', 'modulpage/module_1.ejs', '/img/modules_img/module_1/av.svg', 'module_1.html', ''),
(2, 1, 'Сортировка массива', 'modulpage/module_2.ejs', '/img/modules_img/module_2/av.svg', 'module_2.html', '');

-- --------------------------------------------------------

--
-- Структура таблицы `offers`
--

CREATE TABLE `offers` (
  `offer_id` int(11) NOT NULL,
  `ot_id` int(11) NOT NULL,
  `pl_id` int(11) NOT NULL,
  `offer_price` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `offers`
--

INSERT INTO `offers` (`offer_id`, `ot_id`, `pl_id`, `offer_price`) VALUES
(1, 1, 1, '500'),
(2, 1, 2, '400'),
(3, 1, 3, '900'),
(6, 2, 1, '2000'),
(7, 2, 2, '1800'),
(8, 2, 3, '3200'),
(9, 3, 1, '15000'),
(10, 3, 2, '16000'),
(11, 3, 3, '20000'),
(12, 1, 4, '210'),
(13, 1, 5, '550'),
(14, 2, 4, '120'),
(15, 2, 5, '—'),
(16, 3, 4, '—'),
(17, 3, 5, '—');

-- --------------------------------------------------------

--
-- Структура таблицы `offers_type`
--

CREATE TABLE `offers_type` (
  `ot_id` int(11) NOT NULL,
  `ot_name` varchar(150) NOT NULL,
  `ot_info` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `offers_type`
--

INSERT INTO `offers_type` (`ot_id`, `ot_name`, `ot_info`) VALUES
(1, 'Оптимизация', ''),
(2, 'Разработка', ''),
(3, 'Prod+', '');

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `offer_id` int(11) NOT NULL,
  `order_name` varchar(300) NOT NULL,
  `order_text` text NOT NULL,
  `order_module_use` tinyint(1) NOT NULL,
  `order_final_price` int(11) NOT NULL,
  `order_cr_date` date NOT NULL,
  `order_file` text DEFAULT NULL,
  `order_pages` varchar(10) DEFAULT NULL,
  `order_compl` tinyint(1) NOT NULL,
  `order_dev_type` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `offer_id`, `order_name`, `order_text`, `order_module_use`, `order_final_price`, `order_cr_date`, `order_file`, `order_pages`, `order_compl`, `order_dev_type`) VALUES
(68, 8, 1, 'aaaaaaaaaaaa', 'aaaaaaaaaa', 0, 1320, '2020-11-24', 'public/files/orders/optimisation/2020-11-24_admin@', NULL, 0, NULL),
(69, 8, 2, 'bbbbbbbbb', 'bbbbbbbb', 1, 6800, '2020-11-24', NULL, '4', 0, NULL),
(70, 8, 3, 'cccccccccccc', 'cccccccccccc', 1, 29000, '2020-11-24', NULL, '11_15', 0, 'Кроссплатформенное_приложение'),
(71, 8, 7, 'qwe', 'qwe', 1, 6800, '2020-11-27', NULL, '4', 0, NULL),
(72, 8, 11, 'qwe', 'qwe', 1, 25000, '2020-11-27', NULL, '11_15', 0, 'Офисное_приложение'),
(73, 8, 7, 'ads', 'ads', 0, 3800, '2020-11-30', NULL, '2', 0, NULL),
(74, 8, 8, 'fafs', 'fasf', 0, 4200, '2020-11-30', NULL, '1', 0, NULL),
(75, 8, 1, 'FASF', 'ASF', 0, 210, '2020-11-30', 'public/files/orders/optimisation/2020-11-30_admin@', NULL, 0, NULL),
(76, 8, 1, 'dsada', 'dasd', 0, 210, '2020-12-02', 'public/files/orders/optimisation/2020-12-02_admin@', NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `program_languages`
--

CREATE TABLE `program_languages` (
  `pl_id` int(11) NOT NULL,
  `pl_name` varchar(250) NOT NULL,
  `pl_info` text NOT NULL,
  `pl_img` text DEFAULT NULL,
  `pl_expansion` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `program_languages`
--

INSERT INTO `program_languages` (`pl_id`, `pl_name`, `pl_info`, `pl_img`, `pl_expansion`) VALUES
(1, 'JavaScript', 'JavaScript — мультипарадигменный язык программирования. Поддерживает объектно-ориентированный, императивный и функциональный стили. Является реализацией стандарта ECMAScript. JavaScript обычно используется как встраиваемый язык для программного доступа к объектам приложений.', 'img/modules_img/js.png', '.js'),
(2, 'PHP', 'PHP — скриптовый язык общего назначения, интенсивно применяемый для разработки веб-приложений. В настоящее время поддерживается подавляющим большинством хостинг-провайдеров и является одним из лидеров среди языков, применяющихся для создания динамических веб-сайтов.', 'img/modules_img/php.png', '.php'),
(3, 'PYTHON', 'Python — высокоуровневый язык программирования общего назначения, ориентированный на повышение производительности разработчика и читаемости кода. Синтаксис ядра Python минималистичен. В то же время стандартная библиотека включает большой набор полезных функций.', 'img/modules_img/py.png', '.py'),
(4, 'HTML', 'HTML (от англ. HyperText Markup Language — «язык гипертекстовой разметки») — стандартизированный язык разметки веб-страниц во Всемирной паутине.', 'img/modules_img/html.png', '.html'),
(5, 'CSS', 'CSS — формальный язык описания внешнего вида документа, написанного с использованием языка разметки. Также может применяться к любым XML-документам, например, к SVG или XUL.', 'img/modules_img/css.png', '.css');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_email` varchar(150) NOT NULL,
  `user_number` varchar(11) NOT NULL,
  `user_password` varchar(200) NOT NULL,
  `user_name` varchar(150) NOT NULL,
  `user_sec_name` varchar(150) NOT NULL,
  `user_acc_level` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`user_id`, `user_email`, `user_number`, `user_password`, `user_name`, `user_sec_name`, `user_acc_level`) VALUES
(8, 'admin@qwe.ru', '89169988785', '12345', 'Владислав', 'Костин', 4);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`module_id`),
  ADD KEY `pl_id` (`pl_id`);

--
-- Индексы таблицы `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`offer_id`,`ot_id`),
  ADD KEY `pr_id` (`pl_id`),
  ADD KEY `ot_id` (`ot_id`);

--
-- Индексы таблицы `offers_type`
--
ALTER TABLE `offers_type`
  ADD PRIMARY KEY (`ot_id`);

--
-- Индексы таблицы `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`,`user_id`,`offer_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `offer_id` (`offer_id`);

--
-- Индексы таблицы `program_languages`
--
ALTER TABLE `program_languages`
  ADD PRIMARY KEY (`pl_id`),
  ADD UNIQUE KEY `pl_name` (`pl_name`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_email` (`user_email`),
  ADD UNIQUE KEY `user_number` (`user_number`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `modules`
--
ALTER TABLE `modules`
  MODIFY `module_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `offers`
--
ALTER TABLE `offers`
  MODIFY `offer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT для таблицы `offers_type`
--
ALTER TABLE `offers_type`
  MODIFY `ot_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT для таблицы `program_languages`
--
ALTER TABLE `program_languages`
  MODIFY `pl_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `modules`
--
ALTER TABLE `modules`
  ADD CONSTRAINT `modules_ibfk_1` FOREIGN KEY (`pl_id`) REFERENCES `program_languages` (`pl_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `offers`
--
ALTER TABLE `offers`
  ADD CONSTRAINT `offers_ibfk_1` FOREIGN KEY (`pl_id`) REFERENCES `program_languages` (`pl_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `offers_ibfk_2` FOREIGN KEY (`ot_id`) REFERENCES `offers_type` (`ot_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`offer_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
