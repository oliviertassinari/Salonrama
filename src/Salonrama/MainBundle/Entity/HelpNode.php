<?php

namespace Salonrama\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="help_node")
 * @ORM\Entity(repositoryClass="Salonrama\MainBundle\Entity\HelpNodeRepository")
 */
class HelpNode
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
    * @ORM\ManyToOne(targetEntity="Salonrama\MainBundle\Entity\HelpNode")
    * @ORM\JoinColumn(nullable=true)
    */
    private $parent;

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
     * @return HelpCategorie
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
     * Set parent
     *
     * @param \Salonrama\MainBundle\Entity\HelpNode $parent
     * @return HelpNode
     */
    public function setParent(\Salonrama\MainBundle\Entity\HelpNode $parent = null)
    {
        $this->parent = $parent;
    
        return $this;
    }

    /**
     * Get parent
     *
     * @return \Salonrama\MainBundle\Entity\HelpNode 
     */
    public function getParent()
    {
        return $this->parent;
    }
}