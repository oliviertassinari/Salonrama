<?php

namespace Salonrama\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Salon
 *
 * @ORM\Table(name="salon")
 * @ORM\Entity(repositoryClass="Salonrama\MainBundle\Entity\SalonRepository")
 */
class Salon
{
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(name="name", type="string", length=40)
     */
    private $name;

    /**
     * @ORM\Column(name="email", type="string", length=320)
     */
    private $email;

    /**
     * @ORM\Column(name="phone", type="string", length=20)
     */
    private $phone;

    /**
     * @ORM\Column(name="address", type="string", length=65535)
     */
    private $address;

    /**
     * @ORM\Column(name="zipcode", type="string", length=15)
     */
    private $zipcode;

    /**
     * @ORM\Column(name="city", type="string", length=40)
     */
    private $city;

    /**
     * ISO 3166-1 alpha-2
     *
     * @ORM\Column(name="country", type="string", length=2)
     */
    private $country;

    /**
     * @ORM\Column(name="client", type="text")
     */
    private $client;

    /**
     * @ORM\Column(name="schedule", type="text")
     */
    private $schedule;
}
