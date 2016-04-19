#!/bin/env python
import os
import json
import sys
import glob
import tarfile
import errno

#dump env .. for debugging
for e in os.environ:
    if e.startswith("SCA_"):
        print e, os.environ[e]

config_json=open("config.json").read()
config=json.loads(config_json)

dir=config["source_dir"]

def symlink_force(target, link_name):
    try:
        os.symlink(target, link_name)
    except OSError, e:
        if e.errno == errno.EEXIST:
            os.remove(link_name)
            os.symlink(target, link_name)
        else:
            raise e

#find tar.gz
tars = []
for root, dirs, files in os.walk("../"+dir):
    for file in files:
        if file.endswith(".tar.gz"):
            print "examining",file
            path="../"+dir+"/"+file
    
            #examine files in side .tar.gz
            tar = tarfile.open(path)
            #TODO... I should make this a bit more smarter
            found_diffusion = False
            #for file in tar.list(verbose=False):
            for name in tar.getnames():
                print name 
                if name.startswith("data/diffusion"):
                    found_diffusion = True
            
            #content should look like this
            #life_demo_data.tar.gz
            #-rw-rw-r-- frk/fmri        500 2014-06-30 23:49:33 data/diffusion/life_demo_scan2_subject1_b2000_150dirs_stanford.bvals
            #-rw-rw-r-- frk/fmri  139772126 2014-06-30 23:49:34 data/diffusion/life_demo_scan2_subject1_b2000_150dirs_stanford.nii.gz
            #-rw-rw-r-- frk/fmri       2502 2014-06-30 23:49:34 data/diffusion/life_demo_scan2_subject1_b2000_150dirs_stanford.bvecs
            #-rw-rw-r-- frk/fmri  139708160 2014-06-30 23:49:35 data/diffusion/life_demo_scan1_subject1_b2000_150dirs_stanford.nii.gz
            #-rw-rw-r-- frk/fmri        500 2014-06-30 23:49:35 data/diffusion/life_demo_scan1_subject1_b2000_150dirs_stanford.bvals
            #-rw-rw-r-- frk/fmri       2518 2014-06-30 23:49:35 data/diffusion/life_demo_scan1_subject1_b2000_150dirs_stanford.bvecs
            #-rw-rw-r-- frk/fmri   16690821 2014-06-30 23:49:36 data/tractography/life_demo_mrtrix_tensor_deterministic.mat
            #-rw-rw-r-- frk/fmri   17077523 2014-06-30 23:49:36 data/tractography/life_demo_mrtrix_csd_lmax10_deterministic.mat
            #-rw-rw-r-- frk/fmri   17963689 2014-06-30 23:49:36 data/tractography/life_demo_mrtrix_csd_lmax10_probabilistic.mat
            #-rwxrwxr-x frk/fmri   32950133 2014-06-30 23:49:36 data/anatomy/life_demo_anatomy_t1w_stanford.nii.gz
            #-rw-rw-r-- frk/fmri      70734 2014-06-30 23:49:36 data/anatomy/life_demo_white_matter_region_occipital.nii.gz
            #-rw-rw-r-- frk/fmri        942 2014-06-30 23:49:35 data/lifeDemoDataPath.m
            #-rw-rw-r-- frk/fmri        636 2014-06-30 23:49:36 data/lifeDemoDataPath.m~
            #-rwxrwxr-x frk/fmri          0 2014-07-02 22:07:51 data/diffusion/
            #-rwxrwxr-x frk/fmri          0 2014-07-02 22:09:13 data/tractography/
            #-rwxrwxr-x frk/fmri          0 2014-07-02 22:05:41 data/anatomy/
            #-rwxrwxr-x frk/fmri          0 2014-07-01 00:13:47 data/
            tar.close()

            if found_diffusion:
                #os.symlink(path, file) 
                symlink_force(path, file)
                tars.append({"filename": file, "size": os.path.getsize(path)})
            else:
                print ".tar.gz found but doesn't contain data/diffusion"

#output products.json
with open('products.json', 'w') as out:
    json.dump({"type": "life/brain", "files": tars}, out)

