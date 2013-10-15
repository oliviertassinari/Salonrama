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
            $site = new Site();
            $site->setTheme($DecBdd['si.theme'])
                ->setPathBack($DecBdd['si.loc_home_site'])
                ->setSubdomain($DecBdd['si.sous_dom'])
                ->setImageList($DecBdd['si.image_list'])
                ->setBlockList($DecBdd['si.block_list'])
                ->setPageList($DecBdd['si.page_list'])
                ->setDataList($DecBdd['si.data_list'])
                ->setCreation(new\ DateTime($DecBdd['si.creation_date']))
                ->setLastUpdate(new\ DateTime($DecBdd['si.miseajour_date']))
                ->setIsOnline(($DecBdd['si.en_ligne'] == 'true') ? true : false);

            $salon = new Salon();
            $salon->setName($DecBdd['sa.nom'])
                ->setEmail($DecBdd['sa.email'])
                ->setPhone($DecBdd['sa.telephone'])
                ->setAddress($DecBdd['sa.adresse'])
                ->setZipCode($DecBdd['sa.code_postal'])
                ->setCity($DecBdd['sa.ville'])
                ->setCountry($DecBdd['sa.pays'])
                ->setMenAllowed(true)
                ->setWomenAllowed(true)
                ->setChildrenAllowed(true)
                ->setSchedule($DecBdd['sa.horaire']);

            $account = new Account();
            $account->setFirstName($DecBdd['cl.prenom'])
                    ->setLastName($DecBdd['cl.nom'])
                    ->setSalon($salon)
                    ->setSite($site)
                    ->setLastLogin(new\ DateTime($DecBdd['co.connexion_date']))
                    ->setSignin(new\ DateTime($DecBdd['co.inscription_date']))
                    ->setNewsletterSend(true);

            $user = new User();
            $user->setEmail($DecBdd['co.email'])
                ->setPassword(Encrypter::decode($DecBdd['co.passe']))
                ->setIsActive(($DecBdd['co.valide'] == 'true') ? true : false)
                ->setAccount($account);

            $em->persist($site);
            $em->persist($salon);
            $em->persist($account);
            $em->persist($user);
        }

        $em->flush();

        mysql_close();

        $output->writeln('Migration done.');
    }
}

?>