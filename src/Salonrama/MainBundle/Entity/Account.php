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
    protected $id;

    /**
     * @ORM\Column(name="fist_name", type="string", length=40)
     */
    protected $firstName;

    /**
     * @ORM\Column(name="last_name", type="string", length=40)
     */
    protected $lastName;

    /**
     * @ORM\Column(name="newsletter_send", type="boolean")
     */
    protected $newsletterSend;

    public function getName()
    {
        return $this->getFirstName().' '.$this->getLastName();
    }

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
     * @return Account
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
     * @return Account
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
     * Set newsletterSend
     *
     * @param boolean $sendNewsletter
     * @return Account
     */
    public function setNewsletterSend($newsletterSend)
    {
        $this->newsletterSend = $newsletterSend;
    
        return $this;
    }

    /**
     * Get sendNewsletter
     *
     * @return boolean 
     */
    public function getNewsletterSend()
    {
        return $this->newsletterSend;
    }
}