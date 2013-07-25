<?php

namespace Salonrama\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="account")
 * @ORM\Entity(repositoryClass="Salonrama\MainBundle\Entity\AccountRepository")
 */
class Account
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
     * Set firstName
     *
     * @param string $firstName
     * @return User
     */
    public function setFirstName($firstName)
    {
        $this->firstName = $firstName;
    
        return $this;
    }

    /**
     * Get firstName
     *
     * @return string 
     */
    public function getFirstName()
    {
        return $this->firstName;
    }

    /**
     * Set lastName
     *
     * @param string $lastName
     * @return User
     */
    public function setLastName($lastName)
    {
        $this->lastName = $lastName;
    
        return $this;
    }

    /**
     * Get lastName
     *
     * @return string 
     */
    public function getLastName()
    {
        return $this->lastName;
    }

    /**
     * Set born
     *
     * @param \DateTime $born
     * @return User
     */
    public function setBorn($born)
    {
        $this->born = $born;
    
        return $this;
    }

    /**
     * Get born
     *
     * @return \DateTime 
     */
    public function getBorn()
    {
        return $this->born;
    }
}