<?php 

namespace Salonrama\MainBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Salonrama\MainBundle\Entity\User;
use Salonrama\MainBundle\Entity\Account;
use Salonrama\MainBundle\Entity\Site;
use Salonrama\MainBundle\Entity\Salon;
use Salonrama\MainBundle\File;
use Salonrama\MainBundle\Encrypter;

class MigrateCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('migrate:run')
            ->setDescription("Migration de la v1 a la v2")
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $em = $this->getContainer()->get('doctrine')->getManager();

        mysql_connect('sql.dinhosting.fr', 'salonrama1', 'poukanel');
        mysql_select_db('salonrama2');

        $ReqBdd = mysql_query("SELECT * FROM compte AS co
                    LEFT JOIN client AS cl ON cl.num = co.num
                    LEFT JOIN salon AS sa ON sa.num = co.num
                    LEFT JOIN site AS si ON si.num = co.num WHERE co.valide = 'true'");

        if($ReqBdd === FALSE) {
            die(mysql_error()); // TODO: better error handling
        }

        function mysql_fetch_alias_array($result)
        {
            if (!($row = mysql_fetch_array($result)))
            {
                return null;
            }

            $assoc = Array();
            $rowCount = mysql_num_fields($result);
           
            for ($idx = 0; $idx < $rowCount; $idx++)
            {
                $table = mysql_field_table($result, $idx);
                $field = mysql_field_name($result, $idx);
                $assoc["$table.$field"] = $row[$idx];
            }
           
            return $assoc;
        }

        while($DecBdd = mysql_fetch_alias_array($ReqBdd))
        {
            $block_list = preg_replace('#"V":{"Type":"MilkBox","ImageList":#', '"V":{"Type":"lightbox","ImageList":', utf8_encode($DecBdd['si.block_list']));
            $block_list = preg_replace('#"V":{"Type":"MooFlow","ImageList":#', '"V":{"Type":"thumbnail","ImageList":', $block_list);

            $adresse = preg_replace('#<br>#', ' ', utf8_encode($DecBdd['sa.adresse']));

            $site = new Site();
            $site->setTheme(utf8_encode($DecBdd['si.theme']))
                ->setPathBack($DecBdd['si.loc_home_site'])
                ->setSubdomain(utf8_encode($DecBdd['si.sous_dom']))
                ->setImageList(utf8_encode($DecBdd['si.image_list']))
                ->setBlockList($block_list)
                ->setPageList(utf8_encode($DecBdd['si.page_list']))
                ->setDataList(utf8_encode($DecBdd['si.data_list']))
                ->setCreation(new\ DateTime($DecBdd['si.creation_date']))
                ->setLastUpdate(new\ DateTime($DecBdd['si.miseajour_date']))
                ->setIsOnline(($DecBdd['si.en_ligne'] == 'true') ? true : false);

            $salon = new Salon();
            $salon->setName(utf8_encode($DecBdd['sa.nom']))
                ->setEmail(utf8_encode($DecBdd['sa.email']))
                ->setPhone(utf8_encode($DecBdd['sa.telephone']))
                ->setAddress($adresse)
                ->setZipCode(utf8_encode($DecBdd['sa.code_postal']))
                ->setCity(utf8_encode($DecBdd['sa.ville']))
                ->setCountry(utf8_encode($DecBdd['sa.pays']))
                ->setMenAllowed(true)
                ->setWomenAllowed(true)
                ->setChildrenAllowed(true)
                ->setSchedule(utf8_encode($DecBdd['sa.horaire']));

            $account = new Account();
            $account->setFirstName(utf8_encode($DecBdd['cl.prenom']))
                    ->setLastName(utf8_encode($DecBdd['cl.nom']))
                    ->setSalon($salon)
                    ->setSite($site)
                    ->setLastLogin(new\ DateTime($DecBdd['co.connexion_date']))
                    ->setSignin(new\ DateTime($DecBdd['co.inscription_date']))
                    ->setNewsletterSend(true);

            $user = new User();
            $user->setEmail(utf8_encode($DecBdd['co.email']))
                ->setPassword(Encrypter::decode(utf8_encode($DecBdd['co.passe'])))
                ->setIsActive(($DecBdd['co.valide'] == 'true') ? true : false)
                ->setAccount($account);

            $em->persist($site);
            $em->persist($salon);
            $em->persist($account);
            $em->persist($user);

            $output->writeln('Import '.$DecBdd['co.email']);
        }

        $em->flush();

        mysql_close();

        $userAll = $em->getRepository('SalonramaMainBundle:User')->findAll();

        foreach($userAll as $user)
        {
            $site = $user->getAccount()->getSite();

            $pathBackNew = 'site/online/'.$site->getId().'/';
            File::addFolder('web/'.$pathBackNew);
            //File::copyFolder($site->getPathBack(), $pathBackNew);

            $site->setPathBack($pathBackNew);
            $site->update();

            $this->getContainer()->get('salonrama_main_subdomain')->addSite($site->getSubdomain(), $site->getId());
        }

        $em->flush();

        $output->writeln('Migration done.');
    }
}

?>