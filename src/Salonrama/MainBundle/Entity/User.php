<?php

namespace Salonrama\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * User
 *
 * @ORM\Table(name="user")
 * @ORM\Entity(repositoryClass="Salonrama\MainBundle\Entity\UserRepository")
 */
class User
{
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(name="fist_name", type="string", length=40)
     */
    private $firstName;

    /**
     * @ORM\Column(name="last_name", type="string", length=40)
     */
    private $lastName;

    /**
     * @ORM\Column(name="born", type="date")
     */
    private $born;
}
