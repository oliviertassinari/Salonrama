<?php

namespace Salonrama\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
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
    protected $id;

    /**
     * @ORM\Column(name="name", type="string", length=40)
     */
    protected $name;

    /**
     * @ORM\Column(name="email", type="string", length=320)
     */
    protected $email;

    /**
     * @ORM\Column(name="phone", type="string", length=20)
     */
    protected $phone;

    /**
     * @ORM\Column(name="address", type="string", length=65535)
     */
    protected $address;

    /**
     * @ORM\Column(name="zipcode", type="string", length=15)
     */
    protected $zipcode;

    /**
     * @ORM\Column(name="city", type="string", length=40)
     */
    protected $city;

    /**
     * ISO 3166-1 alpha-2
     *
     * @ORM\Column(name="country", type="string", length=2)
     */
    protected $country;

    /**
     * @ORM\Column(name="men_allowed", type="boolean")
     */
    protected $menAllowed;

    /**
     * @ORM\Column(name="women_allowed", type="boolean")
     */
    protected $womenAllowed;

    /**
     * @ORM\Column(name="schedule", type="text")
     */
    protected $schedule;

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Salon
     */
    public function setName($name)
    {
        $this->name = $name;
    
        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set email
     *
     * @param string $email
     * @return Salon
     */
    public function setEmail($email)
    {
        $this->email = $email;
    
        return $this;
    }

    /**
     * Get email
     *
     * @return string 
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set phone
     *
     * @param string $phone
     * @return Salon
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;
    
        return $this;
    }

    /**
     * Get phone
     *
     * @return string 
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * Set address
     *
     * @param string $address
     * @return Salon
     */
    public function setAddress($address)
    {
        $this->address = $address;
    
        return $this;
    }

    /**
     * Get address
     *
     * @return string 
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * Set zipcode
     *
     * @param string $zipcode
     * @return Salon
     */
    public function setZipcode($zipcode)
    {
        $this->zipcode = $zipcode;
    
        return $this;
    }

    /**
     * Get zipcode
     *
     * @return string 
     */
    public function getZipcode()
    {
        return $this->zipcode;
    }

    /**
     * Set city
     *
     * @param string $city
     * @return Salon
     */
    public function setCity($city)
    {
        $this->city = $city;
    
        return $this;
    }

    /**
     * Get city
     *
     * @return string 
     */
    public function getCity()
    {
        return $this->city;
    }

    /**
     * Set country
     *
     * @param string $country
     * @return Salon
     */
    public function setCountry($country)
    {
        $this->country = $country;
    
        return $this;
    }

    /**
     * Get country
     *
     * @return string 
     */
    public function getCountry()
    {
        return $this->country;
    }

    /**
     * Set schedule
     *
     * @param string $schedule
     * @return Salon
     */
    public function setSchedule($schedule)
    {
        $this->schedule = $schedule;
    
        return $this;
    }

    /**
     * Get schedule
     *
     * @return string 
     */
    public function getSchedule()
    {
        return $this->schedule;
    }

    /**
     * Set menAllowed
     *
     * @param boolean $menAllowed
     * @return Salon
     */
    public function setMenAllowed($menAllowed)
    {
        $this->menAllowed = $menAllowed;
    
        return $this;
    }

    /**
     * Get menAllowed
     *
     * @return boolean 
     */
    public function getMenAllowed()
    {
        return $this->menAllowed;
    }

    /**
     * Set womenAllowed
     *
     * @param boolean $womenAllowed
     * @return Salon
     */
    public function setWomenAllowed($womenAllowed)
    {
        $this->womenAllowed = $womenAllowed;
    
        return $this;
    }

    /**
     * Get womenAllowed
     *
     * @return boolean 
     */
    public function getWomenAllowed()
    {
        return $this->womenAllowed;
    }
}