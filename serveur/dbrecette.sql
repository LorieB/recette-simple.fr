-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  mer. 03 juin 2020 à 08:14
-- Version du serveur :  10.4.10-MariaDB
-- Version de PHP :  7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `dbrecette`
--

-- --------------------------------------------------------

--
-- Structure de la table `ingredient`
--

DROP TABLE IF EXISTS `ingredient`;
CREATE TABLE IF NOT EXISTS `ingredient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `unite` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `ingredient`
--

INSERT INTO `ingredient` (`id`, `nom`, `unite`) VALUES
(1, 'oeuf', NULL),
(2, 'farine', 'g'),
(3, 'sucre', 'g'),
(4, 'chocolat', 'g'),
(5, 'beurre', 'g'),
(6, 'eau', 'cl'),
(7, 'lait', 'cl'),
(9, 'huile', 'cl'),
(10, 'sauce soja', 'cl'),
(11, 'épinards', 'g'),
(12, 'pates', 'g'),
(13, 'poivron', ''),
(14, 'sauce tomate', 'cl'),
(15, 'oignon', ''),
(16, 'patates', ''),
(17, 'echalottes', ''),
(18, 'riz', 'g'),
(19, 'curry', 'g'),
(20, 'crème liquide', 'cl'),
(21, 'vinaigre balsamique', 'cl'),
(22, 'huile de noix', 'cl'),
(23, 'sel', 'g'),
(24, 'poivre', 'g'),
(25, 'huile d\'olive', 'cl'),
(26, 'moutarde', 'g'),
(27, 'pomme', ''),
(28, 'maïs', 'g'),
(29, 'concombre', ''),
(30, 'thon', 'g');

-- --------------------------------------------------------

--
-- Structure de la table `ingr_recette`
--

DROP TABLE IF EXISTS `ingr_recette`;
CREATE TABLE IF NOT EXISTS `ingr_recette` (
  `id_ingredient` int(11) NOT NULL,
  `id_recette` int(11) NOT NULL,
  `quantite` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `ingr_recette`
--

INSERT INTO `ingr_recette` (`id_ingredient`, `id_recette`, `quantite`) VALUES
(12, 37, 300),
(15, 37, 2),
(9, 37, 2),
(16, 2, 4),
(17, 2, 2),
(9, 2, 25),
(4, 3, 200),
(5, 3, 100),
(3, 3, 100),
(2, 3, 50),
(1, 3, 3),
(18, 4, 100),
(19, 4, 10),
(20, 4, 10),
(22, 5, 10),
(25, 6, 7),
(21, 6, 7),
(26, 6, 2),
(27, 7, 3),
(3, 7, 100),
(2, 7, 150),
(5, 7, 90),
(28, 8, 50),
(30, 8, 50),
(9, 1, 2),
(15, 1, 2),
(14, 1, 20),
(12, 1, 250),
(23, 5, 2),
(24, 5, 2),
(23, 6, 2),
(24, 6, 2),
(18, 8, 50);

-- --------------------------------------------------------

--
-- Structure de la table `recette`
--

DROP TABLE IF EXISTS `recette`;
CREATE TABLE IF NOT EXISTS `recette` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titre` varchar(50) NOT NULL,
  `sucre` tinyint(1) NOT NULL,
  `chaud` tinyint(1) NOT NULL,
  `tempsPreparation` time NOT NULL,
  `tempsCuisson` time DEFAULT NULL,
  `temperatureCuisson` int(11) DEFAULT NULL,
  `instructions` text NOT NULL,
  `photo` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `recette`
--

INSERT INTO `recette` (`id`, `titre`, `sucre`, `chaud`, `tempsPreparation`, `tempsCuisson`, `temperatureCuisson`, `instructions`, `photo`) VALUES
(1, 'Pâtes sauce poivron oignon', 0, 1, '00:30:00', '00:20:00', 100, '<h2>Etape 1</h2><br>Éplucher et couper les oignons en petits morceaux<br>Couper le poivron en petits cubes. Il faut retirer les pépins.<br><br><h2>Etape 2</h2><br>Mettre les pâtes a cuire.<br><br><h2>Etape 3</h2><br>Mettre un peu d\'huile dans la poele pour cuire les oignons et poivrons à feu doux en les remuant.<br>Quand ils sont cuits ajouter la sauce tomate pour qu\'elle tiédisse.<br><br><h2>Etape 4</h2><br>Égoutter les pâtes, les mettre dans un saladier et ajouter la sauce.', 'spaguetti.png'),
(2, 'Special boris', 0, 1, '00:30:00', '00:20:00', 200, '<h2>Etape 1</h2><br>Couper les patates en 2 puis en lamelles.<br><h2>Etape 2</h2><br>Mettre la poêle sur le feu et ajouter de l\'huile, une fois chaud mettre les patates dans la poêle.<br><h2>Etape 3</h2><br>Pendant que les patates cuisent découper l\'oignons de la même manière que les patates et découper les échalotes en petits morceaux.<br><h2>Etape 4</h2><br>Une fois que les patates sont cuitent ( molles ) ajouter l\'oignon et les échalotes et réduire le feu ( feu doux ) tout en remuant fréquemment.<br><h2>Etape 5</h2><br>Ajouter du sel et du poivre', 'spaguetti.png'),
(3, 'Gâteau au chocolat', 1, 0, '00:20:00', '00:20:00', 180, '<h2>Etape 1</h2><br>Dans le saladier mélanger le sucre et les oeufs.<br><br><h2>Etape 2</h2><br>Ajouter la farine et mélanger pour qu\'il n\'y ai pas de grumeaux.<br><br><h2>Etape 3</h2><br>Dans le bol mettre le beurre et le chocolat, faire fondre le tout au micro onde.<br><br><h2>Etape 4</h2><br>Incorporer le chocolat fondu à la pâte.<br><br><h2>Etape 5</h2><br>Allumer le four à 180°c pour qu\'il préchauffe<br><br><h2>Etape 6</h2><br>Si le moule n\'est pas en silicone, le beurrer et le fariner. Puis y verser la pâte à gâteau.<br>Mettre à cuire pour 20 min.', 'spaguetti.png'),
(4, 'Riz au curry', 0, 1, '00:15:00', '00:00:00', NULL, '<h2>Etape 1</h2><br>Faire cuire le riz.<br><br><h2>Etape 2</h2><br>Faire tiédir la crème liquide dans le bol, au micro onde. <br><br><h2>Etape 3</h2><br>Mettre le curry dans la crème liquide, bien mélanger.<br><br><h2>Etape 4</h2><br>Verser la crème sur le riz.<br><br>Ps : Si pas de crème liquide, utilise du lait.', 'spaguetti.png'),
(5, 'Vinaigrette légère', 0, 0, '00:02:00', '00:00:00', NULL, '<h2>Etape 1</h2><br>Dans le bocal mettre une pincée de sel et une pincée de poivre.<br>Verser un fond de vinaigre et le double d\'huile.<br><br><h2>Etape 2</h2><br>Fermer le bocal et secouer !<br><br>Petit plus : <br>La vinaigrette se fais par proportion 1/3 de vinaigre et 2/3 d\'huile. En respectant ces proportions tu peux faire de grande quantités de vinaigrette et la garder quelques jours au frigo. ', 'spaguetti.png'),
(6, 'Vinaigrette forte', 0, 0, '00:02:00', '00:00:00', NULL, '<h2>Etape 1</h2><br>Dans le bocal mettre une pincée de sel, un fond de vinaigre et autant d\'huile.<br>Ajouter une petite cuillerée de moutarde.<br><br><h2>Etape 2</h2><br>Fermer le bocal et secouer !<br><br><br><br>Petit plus :<br>En respectant les proportions tu peux en faire de plus grandes quantités a garder quelques jours au frigo.', 'spaguetti.png'),
(7, 'Crumble aux pommes', 1, 0, '00:20:00', '00:35:00', 180, '<h2>Etape 1</h2><br>Éplucher et couper les pommes en morceaux. Les étaler au fond du plat.<br>Saupoudrer avec un sachet de sucre vanillé ou un peu de cannelle moulue.<br><br><h2>Etape 2</h2><br>Dans un saladier, verser la farine, le beurre mou et le sucre.<br>Mélanger avec les doigts de façon à obtenir une pâte sableuse.<br><br><h2>Etape 3</h2><br>Recouvrir les pommes de pâte à crumble et mettre à cuire.<br><br><br><br>Petit plus : <br>Il est possible de changer les fruits au fond du plat, des fruits rouges surgelés, de la rhubarbe... Et dans ce cas ne pas mettre de sucre vanillé ou de cannelle mais juste un peu de sucre sur les fruits.<br>', 'crumble.jpg'),
(8, 'Salade thon maïs ', 0, 1, '00:30:00', '00:30:00', 100, '<h2>Etape 1</h2><br>Cuire le riz. Pendant la cuisson du riz découper le concombre.<br><h2>Etape 2</h2><br>égouter le riz et mélanger le tout.<br><h2>Etape 3</h2><br>AJouter de la vignaigrette ou mayonnaise', 'spaguetti.png');

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'user'),
(2, 'admin');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(1, 'user', 'user@mail.fr', '$2a$08$cNrtB.tW7b7JA3llu0sG..oOtXx6fKi1AZMItQvZlJDEMsBPGbHt.'),
(2, 'admin', 'admin@mail.fr', '$2a$08$zYs/.Dw081.vAOWjs7qHDebbHIM65j8UhYVku.NJMYiS.o91qM6FW');

-- --------------------------------------------------------

--
-- Structure de la table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE IF NOT EXISTS `user_roles` (
  `roleId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`roleId`,`userId`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `user_roles`
--

INSERT INTO `user_roles` (`roleId`, `userId`) VALUES
(1, 1),
(1, 2),
(1, 4),
(1, 5),
(2, 2),
(2, 5);

-- --------------------------------------------------------

--
-- Structure de la table `ustensile`
--

DROP TABLE IF EXISTS `ustensile`;
CREATE TABLE IF NOT EXISTS `ustensile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `ustensile`
--

INSERT INTO `ustensile` (`id`, `nom`) VALUES
(1, 'fourchette'),
(2, 'saladier'),
(3, 'bol'),
(4, 'cuillère à café'),
(5, 'cuillère à soupe'),
(6, 'couteau'),
(7, 'moule'),
(8, 'poele'),
(9, 'casserole'),
(10, 'spatule en bois'),
(11, 'balance'),
(12, 'fouet'),
(13, 'bocal'),
(14, 'plat à four'),
(15, 'épluche légume');

-- --------------------------------------------------------

--
-- Structure de la table `ust_recette`
--

DROP TABLE IF EXISTS `ust_recette`;
CREATE TABLE IF NOT EXISTS `ust_recette` (
  `id_ustensile` int(11) NOT NULL,
  `id_recette` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `ust_recette`
--

INSERT INTO `ust_recette` (`id_ustensile`, `id_recette`) VALUES
(8, 37),
(9, 37),
(10, 37),
(6, 37),
(2, 37),
(9, 38),
(8, 2),
(6, 2),
(10, 2),
(2, 3),
(7, 3),
(3, 3),
(11, 3),
(12, 3),
(9, 4),
(3, 4),
(13, 5),
(2, 7),
(11, 7),
(6, 7),
(14, 7),
(9, 8),
(6, 1),
(9, 1),
(8, 1),
(10, 1),
(13, 5),
(13, 6),
(4, 6),
(6, 8),
(2, 8),
(15, 8),
(9, 8);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
